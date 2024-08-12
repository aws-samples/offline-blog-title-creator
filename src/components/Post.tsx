"use client";
import { Schema } from "../../amplify/data/resource";

const Post = ({
  post,
  onDelete,
}: {
  post: Pick<Schema["Post"]["type"], "title" | "id">;
  onDelete: (id: string) => void;
}) => {
  function onDetail() {
    console.log("clicked");
  }

  return (
    <div className="border bg-gray-100 w-full p-4 rounded flex justify-between ">
      <button onClick={onDetail}>
        <div className="flex gap-2">
          <div>Title:</div>
          <div>{post.title}</div>
        </div>
      </button>
      <input type="hidden" name="id" id="id" value={post.id} />
      <button
        className="text-red-500 cursor-pointer"
        onClick={() => onDelete(post.id)}
      >
        X
      </button>
    </div>
  );
};

export default Post;
