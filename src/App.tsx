import "./App.css";
import { useState, FormEvent } from "react";
import {
  Button,
  useAuthenticator,
  TextField,
  Heading,
  View,
} from "@aws-amplify/ui-react";
import Post from "./components/Post";
import { useTitles, titleKeys } from "./useTitles";

function App() {
  const { signOut } = useAuthenticator((context) => [context.user]);
  const [post, setPost] = useState("");

  const { addKey, deleteKey, queryKey } = titleKeys;

  const { deleteMutation, mutation, query } = useTitles({
    addKey,
    deleteKey,
    queryKey,
  });

  async function onAddTitle(form: FormEvent<HTMLFormElement>) {
    form.preventDefault();
    const title = new FormData(form.currentTarget).get("title") as string;
    if (!title) return;
    mutation.mutate(title);
    setPost("");
  }

  async function onDeletePost(id: string) {
    deleteMutation.mutate(id);
  }

  return (
    <View className="flex flex-col w-1/2 m-auto gap-2">
      <Heading level={2} className="text-3xl text-green-400">
        Add Post Title
      </Heading>
      <View
        as="form"
        className="flex flex-col w-48 m-auto gap-4"
        onSubmit={onAddTitle}
      >
        <TextField
          label="Title:"
          placeholder="Some title..."
          name="title"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />

        <Button type="submit" variation="primary">
          Add Title
        </Button>
        {mutation.isPaused || deleteMutation.isPaused ? (
          <View color="red" textAlign="center">
            You are offline! Data will be sent when online.
          </View>
        ) : null}
      </View>
      {query.data?.map((post) => (
        <Post key={post.id} post={post} onDelete={onDeletePost} />
      ))}
      <Button width="10rem" onClick={signOut} variation="warning">
        Sign Out
      </Button>
    </View>
  );
}

export default App;
