import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';
import AppLayout from './components/layout/common/Layout/Layout/AppLayout';
import { theme } from './theme/theme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Transaction } from './types/index'; //ここ気をつけて、importしないとtransactionの中身は空だよ
import { formatMonth } from './utils/formatting';
import { Schema } from './validations/schema';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  // console.log(currentMonth);
  // const a = format(currentMonth, 'yyyy-MM');
  // console.log(a);

  //firestoreエラーかどうかを判定する型ガード
  function isFireStoreError(err: unknown): err is { code: string; message: string } {
    return typeof err === 'object' && err !== null && 'code' in err;
  }

  // firestoreのデータを全て取得
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Transactions'));
        const transactionsData = querySnapshot.docs.map((doc) => {
          // // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          return {
            ...(doc.data() as Transaction),
            id: doc.id,
          } as unknown as Transaction;
        });
        setTransactions(transactionsData);
      } catch (err) {
        if (isFireStoreError(err)) {
          console.log('firebaseのエラーは:', err);
          console.log('firebaseのエラーメッセージは:', err.message);
          console.log('firebaseのエラーコードは:', err.code);
        } else {
          console.error('一般的なエラーは:', err);
        }
      } finally {
        setIsLoading(false);
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
      const filterdTransactions = transactions.filter((transaction) => transaction.id !== transactionId);
      setTransactions(filterdTransactions);
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

  const handleUpdateTransaction = async (transaction: Schema, transactionId: string) => {
    try {
      //更新処理
      const docRef = doc(db, 'Transactions', transactionId);
      // Set the "capital" field of the city 'DC'
      await updateDoc(docRef, transaction);
      // フロント更新
      const updatedTransactions = transactions.map((t) =>
        t.id === transactionId ? { ...t, ...transaction } : t
      ) as Transaction[]; //tは元々のデータ、transactionはフォームに入力されたデータ
      setTransactions(updatedTransactions);
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
                  onUpdateTransaction={handleUpdateTransaction}
                />
              }
            />
            <Route
              path='/report'
              element={
                <Report
                  currentMonth={currentMonth}
                  setCurrentMonth={setCurrentMonth}
                  monthlyTransactions={monthlyTransactions}
                  isLoading={isLoading}
                />
              }
            />
            <Route path='*' element={<NoMatch />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
