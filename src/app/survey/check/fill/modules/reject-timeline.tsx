'use client';

import { Timeline } from 'antd';

interface RejectTimelineProps {}

const RejectTimeline = (props: RejectTimelineProps) => {
  return (
    <div className="p-10">
      <Timeline
        items={[
          {
            color: 'red',
            children: (
              <>
                <h2 className="text-lg font-bold">填写不规范 2015-09-01</h2>
                <p className="max-w-80">比如啊打发爱德发顺丰到付</p>
              </>
            ),
          },
          {
            color: 'red',
            children: (
              <>
                <h2 className="text-lg font-bold">
                  填写不规范填写不规范 2015-09-02
                </h2>
                <p className="max-w-80">比如啊打发爱德发顺丰到付</p>
              </>
            ),
          },
          {
            color: 'red',
            children: (
              <>
                <h2 className="text-lg font-bold">填写不规范 2015-09-03</h2>
                <p className="max-w-80">
                  比如啊打发爱德发顺丰到付比如啊打发爱德发顺丰到付比如啊打发爱德发顺丰到付
                  比如啊打发爱德发顺丰到付
                  比如啊打发爱德发顺丰到付比如啊打发爱德发顺丰到付比如啊打发爱德发顺丰到付比如啊打发爱德发顺丰到付
                  比如啊打发爱德发顺丰到付
                </p>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};

export default RejectTimeline;
