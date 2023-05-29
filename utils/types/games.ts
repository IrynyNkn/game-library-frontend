export type GameDto = {
  title: string;
  description: string;
  imageLink: string;
  publisherId: string;
  ageRestriction: number;
  releaseYear: number;
  genres: string[];
  platforms: string[];
  ratings: string[];
  comments: string[];
};

export type GameFormType = {
  title: string;
  description: string;
  gameImage: string;
  publisherId: string;
  ageRestriction: string;
  releaseYear: string;
  genres: {
    value: string;
    label: string;
  }[];
  platforms: {
    value: string;
    label: string;
  }[];
};

export type PublisherType = {
  id: string;
  name: string;
};

export type GenreType = PublisherType;
export type PlatformsType = PublisherType;

export type GameListType = {
  id: string;
  title: string;
  publisher: PublisherType;
  genres: GenreType[];
  platforms: PlatformsType[];
  imageLink: string;
};

export type GameDataType = {
  id: string;
  title: string;
  description: string;
  imageLink: string;
  publisher: PublisherType;
  ageRestriction: number;
  releaseYear: number;
  genres: GenreType[];
  platforms: PlatformsType[];
  gameRating: number;
  ratings: any[];
  comments: any[];
};

export type CommentType = {
  commentLikes: any[];
  gameId: string;
  id: string;
  parentId: string | null;
  userId: string;
  value: string;
  user: {
    userName: string;
    badgeColor: string;
  };
  replyUserMention?: string;
  createdAt: string;
};

export type ReplyDataType = {
  gameDataId: string;
  parentId: string | null;
};

export type CommentPostDto = {
  userId: string;
  gameId: string;
  value: string;
  parentId: null | string;
};

export type RatingType = {
  gameId: string;
  id: string;
  userId: string;
  value: number;
};

export type EditButtonFunctionType = (id: string) => Promise<boolean>;
export type DeleteButtonFunctionType = (id: string) => void;

export type CellRenderMethodsType = {
  renderCell?: {
    [key: string]: (val: any[] | string) => JSX.Element[];
  };
  onEditClick: EditButtonFunctionType;
  onDeleteClick: DeleteButtonFunctionType;
};

export type GameFieldsFormType = {
  name: string;
};
