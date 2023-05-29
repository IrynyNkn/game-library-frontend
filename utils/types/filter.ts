export type FilterTagType = {
  id: string;
  name: string;
};

export type FilterCategoriesType = {
  label: string;
  tags: FilterTagType[];
};

export type AppliedFilterType = {
  label: string; // 'genres' | 'platforms' | 'publishers'
  tags: string[];
};
