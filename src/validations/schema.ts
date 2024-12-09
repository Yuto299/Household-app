import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  date: z.string().min(1, { message: ' 日付は必須です' }), //最低１文字は入力してください
  amount: z.number().min(1, { message: '金額は必須です' }), //数値の１以上を受け付けます
  content: z
    .string()
    .min(1, { message: '内容を入力してください' })
    .max(50, { message: '内容は５０文字以内にしてください' }),

  category: z
    .union([
      z.enum(['食費', '日用品', '家賃', '交際費', '娯楽', '交通費', '給与', '副収入', 'お小遣い']),
      z.literal(''), // 空文字列を許容
    ])
    .refine((val) => val !== '', {
      message: 'カテゴリを選択してください',
    }),
});

export type Schema = z.infer<typeof transactionSchema>;
