import { ObjectId } from "mongoose";

interface FullDocument {
  _id: ObjectId;
  name: string;
  __v: number;
}

interface DocumentKey {
  _id: ObjectId;
}

export interface ChangeStreamDocumentInterface {
  _id: {
    _data: string;
  };
  operationType:
    | "insert"
    | "update"
    | "replace"
    | "delete"
    | "invalidate"
    | "drop"
    | "rename"
    | "dropDatabase";
  clusterTime: Date;
  fullDocument: FullDocument;
  ns: {
    db: string;
    coll: string;
  };
  documentKey: DocumentKey;
}
