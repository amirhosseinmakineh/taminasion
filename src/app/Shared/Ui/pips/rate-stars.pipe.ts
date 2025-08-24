// src/app/Shared/Ui/pips/rate-stars.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { RateEnum } from '../../../../../Enums/RateEnum.enum'

@Pipe({ name: 'rateStars', standalone: true, pure: true })
export class RateStarsPipe implements PipeTransform {
  transform(
    rate: number | string | null | undefined,
    maxStars = 5,                    // چند ستاره می‌خوای نمایش بدی
    top: number = RateEnum.VeryGood, // بیشینه‌ی مقیاس ورودی (از enum)
    round: 'round' | 'floor' | 'ceil' = 'round' // روش گرد کردن
  ): string {
    const n = Number(rate ?? 0);
    const safeTop = Math.max(1, Number(top ?? 1));
    const clamped = Number.isFinite(n)
      ? Math.min(safeTop, Math.max(0, Math.trunc(n)))
      : 0;

    const raw = (clamped / safeTop) * maxStars;
    const filled =
      round === 'floor' ? Math.floor(raw) :
      round === 'ceil'  ? Math.ceil(raw)  :
                          Math.round(raw); // پیش‌فرض: round

    return '★'.repeat(filled) + '☆'.repeat(maxStars - filled);
  }
}
