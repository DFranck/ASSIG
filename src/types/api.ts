// /types/api.ts
export type ParamsWithId = {
  params: {
    id: string;
  };
};

export type ParamsWithIdAndQuery = {
  params: {
    id: string;
  };
  query: {
    [key: string]: string;
  };
};
