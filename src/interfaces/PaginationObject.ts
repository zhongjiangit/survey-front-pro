export interface PaginationObject<T = any> {
  /**
   * 数据总条数
   */
  total: number;
  /**
   * 每页数据条数
   */
  limit: number;
  /**
   * 当前页开始位置（offset / limit = 页码）
   */
  offset: number;
  /**
   * 当前页数据
   */
  data: T[];
}
