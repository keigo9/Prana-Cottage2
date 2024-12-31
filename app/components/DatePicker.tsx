import {useEffect, useState, type Dispatch, type SetStateAction} from 'react';
import {useLocation, useSearchParams} from '@remix-run/react';

import type {CaptionProps, DateFormatter, DateRange} from 'react-day-picker';
import {DayPicker, IconLeft, IconRight, useNavigation} from 'react-day-picker';
import {addDays, differenceInCalendarDays, format, isSameMonth} from 'date-fns';
import 'react-day-picker/dist/style.css';
import {ja} from 'date-fns/locale';

export type Event = {
  id: string;
  start: string;
  end: string;
};

interface DatePickerProps {
  range: DateRange | undefined;
  setRange: Dispatch<SetStateAction<DateRange | undefined>>;
  setIsSelectedDays: Dispatch<SetStateAction<boolean>>;
  events: Event[];
}

export const DatePicker: React.FC<DatePickerProps> = ({
  range,
  setRange,
  setIsSelectedDays,
  events,
}) => {
  const locale = ja;
  const today = new Date();
  const location = useLocation();
  // searchParamsの値によってvariantが変わるので、searchParamsを管理する
  const [searchParams, setSearchParams] = useSearchParams();
  // 2日以降から選択可能
  const selectAbleStartDate = addDays(today, 2);
  // 150日まで選択可能
  const maxDate = addDays(today, 150);

  const handleResetClick = () => setRange(undefined);
  const [month, setMonth] = useState<Date>(today);

  const resetButton = (
    <button
      onClick={handleResetClick}
      style={{border: '1px solid'}}
      className="rdp-button px-1"
    >
      Reset
    </button>
  );
  const todayButton = (
    <button
      disabled={isSameMonth(today, month)}
      onClick={() => setMonth(today)}
      style={{border: '1px solid'}}
      className="rdp-button px-1"
    >
      今日
    </button>
  );

  const seasonEmoji: Record<string, string> = {
    winter: '⛄️',
    spring: '🌸',
    summer: '🌻',
    autumn: '🍂',
  };
  const getSeason = (month: Date): string => {
    const monthNumber = month.getMonth() + 1;
    if (monthNumber == 12 || monthNumber < 3) return 'winter';
    if (monthNumber >= 3 && monthNumber < 6) return 'spring';
    if (monthNumber >= 6 && monthNumber < 9) return 'summer';
    else return 'autumn';
  };
  const formatCaption: DateFormatter = (date, options) => {
    const season = getSeason(date);
    return (
      <div className="rdp-caption_label gap-2">
        <span role="img" aria-label={season}>
          {seasonEmoji[season]}
        </span>{' '}
        {format(date, 'LLLL', {locale: options?.locale})}
        {format(date, 'yyyy', {locale: options?.locale})}
      </div>
    );
  };

  function CustomCaption(props: CaptionProps) {
    const {goToMonth, nextMonth, previousMonth} = useNavigation();
    return (
      <div className="rdp-caption">
        {formatCaption(props.displayMonth, {locale})}
        <div className="rdp-nav flex">
          <button
            disabled={!previousMonth}
            onClick={() => previousMonth && goToMonth(previousMonth)}
            className="rdp-button_reset rdp-button rdp-nav_button rdp-nav_button_previous w-30"
            style={{width: '30px', height: '30px'}}
          >
            <IconLeft className="rdp-nav_icon" />
          </button>
          <button
            disabled={!nextMonth}
            onClick={() => nextMonth && goToMonth(nextMonth)}
            className="rdp-button_reset rdp-button rdp-nav_button rdp-nav_button_next"
            style={{width: '30px', height: '30px'}}
          >
            <IconRight className="rdp-nav_icon" />
          </button>
          {todayButton}
        </div>
      </div>
    );
  }

  const disabledDays = (events || []).map((event) => {
    const range = {
      from: event.start ? new Date(event.start) : undefined,
      to: event.end ? new Date(event.end) : undefined,
    } as DateRange;
    return range;
  });

  let footer = <p>日付を選択してください</p>;
  if (range?.from) {
    if (!range.to) {
      footer = (
        <div>
          <p>チェックイン: {format(range.from, 'PPP', {locale})}</p>
          {resetButton}
        </div>
      );
    } else if (range.to) {
      const stayDaysNight = differenceInCalendarDays(range.to, range.from);
      footer = (
        <div>
          <p>
            チェックイン: {format(range.from, 'PPP', {locale})}
            <br />
            チェックアウト: {format(range.to, 'PPP', {locale})}
            <br />
            宿泊日数: {stayDaysNight}日
          </p>
          {resetButton}
        </div>
      );
    }
  }

  useEffect(() => {
    setIsSelectedDays(false);
    let stayDaysNight = 1;
    if (range?.from && range?.to) {
      stayDaysNight = differenceInCalendarDays(range.to, range.from);
      setIsSelectedDays(true);
    }
    const params = new URLSearchParams(location.search);
    params.set('Duration', `${stayDaysNight}Day`);
    setSearchParams(params);
  }, [
    range?.to,
    range?.from,
    location.search,
    setIsSelectedDays,
    setSearchParams,
  ]);

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (!range) {
      setRange(range);
      return;
    }

    // 選択範囲が無効な日付と重なっているかチェック
    const isRangeDisabled = disabledDays.some((disabled) => {
      const disabledStart = disabled.from ? new Date(disabled.from) : null;
      const disabledEnd = disabled.to ? new Date(disabled.to) : null;

      if (!disabledStart || !disabledEnd || !range.from || !range.to)
        return false;

      return !(range.to < disabledStart || range.from > disabledEnd);
    });

    if (!isRangeDisabled) {
      setRange(range);
    }
  };

  return (
    <DayPicker
      id="bookingDatePicker"
      className="!ml-0"
      mode="range"
      selected={range}
      onSelect={handleRangeSelect}
      max={8}
      toDate={maxDate}
      showOutsideDays
      month={month}
      onMonthChange={setMonth}
      fromDate={selectAbleStartDate}
      disabled={disabledDays}
      footer={footer}
      components={{
        Caption: CustomCaption,
      }}
      locale={locale}
    />
  );
};
