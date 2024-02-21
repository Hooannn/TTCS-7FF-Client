export interface ICategory {
  _id?: string;
  name: IContent;
  description: IContent;
  icon?: string;
  createdAt?: string;
  categoryId: string;
}
export interface IContent {
  vi: string;
  en: string;
}
