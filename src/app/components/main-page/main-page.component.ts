import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, PLATFORM_ID, ViewChild } from '@angular/core';

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

interface StepCard {
  icon: string;
  title: string;
  description: string;
}

interface StatCard {
  target: number;
  label: string;
}

interface FaqItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

interface WhyCard {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

interface BlogPost {
  image: string;
  title: string;
  summary: string;
  link: string;
}

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  standalone: false,
})
export class MainPageComponent implements AfterViewInit {
  @ViewChild('statsSection') statsSection?: ElementRef<HTMLElement>;

  businessFeatures: FeatureCard[] = [
    { icon: '📊', title: 'داشبورد مدیریتی', description: 'مدیریت نوبت‌ها، آمار و عملکرد.' },
    { icon: '💵', title: 'حسابداری خودکار', description: 'محاسبه و ثبت درآمدها و هزینه‌ها.' },
    { icon: '📢', title: 'ویدیو مارکتینگ', description: 'افزایش دیده‌شدن با ویدیوهای تبلیغاتی.' },
    { icon: '✉️', title: 'ارسال پیامک', description: 'تبلیغات و یادآوری نوبت.' },
  ];

  customerFeatures: FeatureCard[] = [
    { icon: '💈', title: 'رزرو آسان', description: 'فقط با چند کلیک نوبت خودت رو رزرو کن.' },
    { icon: '⏰', title: 'یادآوری خودکار', description: 'پیامک یادآوری دریافت کن تا نوبت یادت نره.' },
    { icon: '💳', title: 'پرداخت آنلاین', description: 'رزرو و پرداخت در یک مرحله.' },
    { icon: '⭐', title: 'امتیاز و نظر', description: 'قبل از رزرو، نظر بقیه رو ببین.' },
  ];

  steps: StepCard[] = [
    { icon: '📝', title: '۱. ثبت‌نام', description: 'ثبت‌نام سریع برای کاربر یا آرایشگاه' },
    { icon: '💇', title: '۲. انتخاب آرایشگاه', description: 'جستجو و مشاهده بهترین سالن‌ها' },
    { icon: '📅', title: '۳. رزرو نوبت', description: 'رزرو آسان و دریافت یادآوری خودکار' },
  ];

  stats: StatCard[] = [
    { target: 800, label: 'کسب‌و‌کار فعال' },
    { target: 25000, label: 'نوبت رزرو شده' },
    { target: 15, label: 'شهر تحت پوشش' },
  ];

  currentStats = this.stats.map(() => 0);
  private statsAnimated = false;

  faqs: FaqItem[] = [
    { question: 'آیا رزرو برای کاربران رایگان است؟', answer: 'بله، رزرو برای کاربران رایگان است.' },
    { question: 'آیا کسب‌وکارها هزینه‌ای می‌پردازند؟', answer: 'بسته به پلن انتخابی، هزینه‌ها مشخص هستند.' },
    { question: 'آیا پیامک یادآوری ارسال می‌شود؟', answer: 'بله، تایمیناسیون به‌طور خودکار پیامک یادآوری می‌فرستد.' },
  ];

  whyUs: WhyCard[] = [
    { icon: '🚀', title: 'سرعت بالا', description: 'رزرو و ثبت خدمات فقط در چند ثانیه' },
    { icon: '🔒', title: 'امنیت', description: 'پرداخت امن و اطلاعات محرمانه' },
    { icon: '🧠', title: 'مدیریت هوشمند', description: 'سیستم اتوماتیک برای مدیریت کسب‌وکار' },
  ];

  testimonials: Testimonial[] = [
    { name: 'مریم رضایی', role: 'کاربر تایمیناسیون', quote: 'خیلی راحت و سریع نوبتم رو گرفتم. پیامک یادآوری هم عالی بود.' },
    { name: 'سالن نیکا', role: 'صاحب کسب‌وکار', quote: 'با تایمیناسیون فروش ما ۳ برابر شد! داشبوردش خیلی کاربرپسنده.' },
  ];

  blogPosts: BlogPost[] = [
    {
      image: 'https://images.unsplash.com/photo-1593702175554-9a8b0976d79a',
      title: '۵ روش برای جذب مشتری بیشتر',
      summary: 'ترفندهایی برای رشد سریع کسب‌وکارهای زیبایی',
      link: '/blog/1',
    },
    {
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd5e',
      title: 'اهمیت پیامک یادآوری نوبت',
      summary: 'چطور نوبت‌ها را کاهش ندهیم و مشتری را راضی نگه داریم.',
      link: '/blog/2',
    },
    {
      image: 'https://images.unsplash.com/photo-1596704017262-38a3a0f86f49',
      title: 'داشبورد مدیریتی آرایشگاه‌ها',
      summary: 'با چند کلیک، تمام اطلاعات کسب‌وکارت را ببین!',
      link: '/blog/3',
    },
  ];

  showScrollTop = false;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    setTimeout(() => this.checkStatsAnimation(), 200);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) {
      return;
    }

    this.showScrollTop = window.scrollY > 200;
    this.checkStatsAnimation();
  }

  scrollToTop(): void {
    if (!this.isBrowser) {
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleFaq(index: number): void {
    this.faqs = this.faqs.map((item, i) => ({
      ...item,
      isOpen: i === index ? !item.isOpen : false,
    }));
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fa-IR').format(value);
  }

  private checkStatsAnimation(): void {
    if (this.statsAnimated || !this.statsSection) {
      return;
    }

    const rect = this.statsSection.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 0;
    if (rect.top <= viewportHeight * 0.85) {
      this.animateStats();
    }
  }

  private animateStats(): void {
    this.statsAnimated = true;
    const steps = 60;
    const duration = 1500;
    const interval = Math.max(16, Math.floor(duration / steps));

    this.stats.forEach((stat, index) => {
      let currentStep = 0;
      const timer = window.setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        this.currentStats[index] = Math.round(stat.target * easedProgress);

        if (currentStep >= steps) {
          this.currentStats[index] = stat.target;
          window.clearInterval(timer);
        }
      }, interval);
    });
  }
}
