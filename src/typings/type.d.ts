import { SVGProps } from 'react';

declare global {
  module '*.svg' {
    export const ReactComponent: React.FC<
      SVGProps<SVGSVGElement> & {
        title?: string;
      }
    >;
    export default ReactComponent;
  }
}

declare type AnyObject = {
  [propName: string]: any;
};
