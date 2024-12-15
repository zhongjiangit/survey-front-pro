'use client';

import { ListRejectFillResponse } from '@/api/task/listRejectFill';
import { Timeline } from 'antd';

interface RejectTimelineProps {
  items: ListRejectFillResponse[];
}

const RejectTimeline = ({ items = [] }: RejectTimelineProps) => {
  return (
    <div className="p-10">
      <Timeline
        items={
          items.map(item => ({
            color: 'red',
            children: (
              <>
                <h2 className="text-lg font-bold">
                  {item.rejecterName} {item.rejectTime}
                </h2>
                <p className="max-w-80">{item.rejectComment}</p>
              </>
            ),
          })) || []
        }
      />
    </div>
  );
};

export default RejectTimeline;
