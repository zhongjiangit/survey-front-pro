import { FunctionComponent } from 'react';

interface CircleProps {
  value: number | string;
  [key: string]: any;
}

const Circle: FunctionComponent<CircleProps> = ({ value, ...props }) => {
  return (
    <div
      className="rounded-full border border-gray-300 p-1 w-7 h-7 flex items-center justify-center text-blue-500 underline"
      {...props}
    >
      {value}
    </div>
  );
};

export default Circle;
