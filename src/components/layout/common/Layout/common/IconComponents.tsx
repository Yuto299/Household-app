import {
  AddBusiness,
  AddHome,
  Alarm,
  Diversity3,
  Fastfood,
  Savings,
  SportsTennis,
  Train,
  Work,
} from '@mui/icons-material';
import { ExpenseCategory, IncomeCategory } from '../../../../../types';

const IconComponents: Record<IncomeCategory | ExpenseCategory, JSX.Element> = {
  食費: <Fastfood fontSize='small' />,
  日用品: <Alarm fontSize='small' />,
  家賃: <AddHome fontSize='small' />,
  交際費: <Diversity3 fontSize='small' />,
  娯楽: <SportsTennis fontSize='small' />,
  交通費: <Train fontSize='small' />,
  給与: <Work fontSize='small' />,
  副収入: <Savings fontSize='small' />,
  お小遣い: <AddBusiness fontSize='small' />,
};

export default IconComponents;
