import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/common/Layout/Layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Transaction } from './types/index'; //ここ気をつけて、importしないとtransactionの中身は空だよ
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';

function App() {
  //firestoreエラーかどうかを判定する型ガード
  function isFireStoreError(err: unknown): err is { code: string; message: string } {
    return typeof err === 'object' && err !== null && 'code' in err;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // console.log(currentMonth);
  // const a = format(currentMonth, 'yyyy-MM');
  // console.log(a);

  // firestoreのデータを全て取得
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Transactions'));

        const transactionsDate = querySnapshot.docs.map((doc) => {
          // // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          return {
            ...(doc.data() as Transaction),
            id: doc.id,
          } as unknown as Transaction;
        });

        console.log(transactionsDate);
        setTransactions(transactionsDate);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.log('firebaseのエラーは:', err);
          console.log('firebaseのエラーメッセージは:', err.message);
          console.log('firebaseのエラーコードは:', err.code);
        } else {
          console.error('一般的なエラーは:', err);
        }
      }
    };

    fetchTransactions();
  }, []);

  //ひと月分のデータ
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth)); //new dateが入っているので今月分のデータだけが表示される
  });

  //取引を保存する処理
  const handleSaveTransaction = async (transaction: Schema) => {
    console.log(transaction);
    try {
      //firestoreにデータを保存
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, 'Transactions'), transaction);
      console.log('Document written with ID: ', docRef.id);

      const newTransaction = {
        id: docRef.id,
        ...transaction,
      } as Transaction;

      console.log(newTransaction);
      setTransactions((prevTransaction) => [...prevTransaction, newTransaction]);
    } catch (err) {
      if (isFireStoreError(err)) {
        console.log('firebaseのエラーは:', err);
        console.log('firebaseのエラーメッセージは:', err.message);
        console.log('firebaseのエラーコードは:', err.code);
      } else {
        console.error('一般的なエラーは:', err);
      }
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    //firestoreのデータを削除
    try {
      await deleteDoc(doc(db, 'Transactions', transactionId));
    } catch (err) {
      if (isFireStoreError(err)) {
        console.log('firebaseのエラーは:', err);
        console.log('firebaseのエラーメッセージは:', err.message);
        console.log('firebaseのエラーコードは:', err.code);
      } else {
        console.error('一般的なエラーは:', err);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route
              index
              element={
                <Home
                  monthlyTransactions={monthlyTransactions}
                  setCurrentMonth={setCurrentMonth}
                  onSaveTransaction={handleSaveTransaction}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              }
            />
            <Route path='/report' element={<Report />} />
            <Route path='*' element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
