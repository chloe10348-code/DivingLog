import { z } from 'zod';

export const diveLogSchema = z.object({
  date: z.date({ required_error: '请选择日期' }),
  diveSiteName: z.string().min(1, '请选择或输入潜点名称'),
  diveType: z.enum(['reef', 'wreck', 'cave', 'drift', 'night', 'deep'], {
    required_error: '请选择潜水类型',
  }),
  buddyName: z.string().optional(),
  maxDepth: z.number().min(0, '深度不能为负').max(200, '深度不能超过200米'),
  bottomTime: z.number().min(0, '时间不能为负').max(600, '时间不能超过10小时'),
  waterTemp: z.number().min(-5, '水温不能低于-5°C').max(45, '水温不能高于45°C'),
  visibility: z.number().min(0, '能见度不能为负').max(100, '能见度不能超过100米'),
  startPressure: z.number().min(0, '气压不能为负').max(400, '气压不能超过400 bar'),
  endPressure: z.number().min(0, '气压不能为负').max(400, '气压不能超过400 bar'),
  tankSize: z.number().min(0, '气瓶大小不能为负').max(20, '气瓶大小不能超过20升').default(12),
  weight: z.number().min(0, '配重不能为负').max(50, '配重不能超过50 kg'),
  notes: z.string().max(5000, '备注不能超过5000字').optional(),
  photos: z.array(z.string().url()).max(5, '最多上传5张照片').default([]),
  rating: z.number().min(1, '请至少选择1星').max(5, '最多5星'),
  safetyChecks: z.object({
    buddyCheck: z.boolean().refine((val) => val === true, '请确认已与潜伴检查装备'),
    gearCheck: z.boolean().refine((val) => val === true, '请确认已检查个人装备'),
    buoyancyCheck: z.boolean().refine((val) => val === true, '请确认已检查浮力控制'),
    emergencyPlan: z.boolean().refine((val) => val === true, '请确认已了解应急方案'),
    divePlan: z.boolean().refine((val) => val === true, '请确认已了解潜水计划'),
  }),
});

export type DiveLogInput = z.infer<typeof diveLogSchema>;
