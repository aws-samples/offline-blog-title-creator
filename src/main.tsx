import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Layout from "./Layout.tsx";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { generateClient } from "aws-amplify/api";
import { Schema } from "../amplify/data/resource.ts";
import { titleKeys } from "./useTitles.ts";

const { addKey, deleteKey, queryKey } = titleKeys;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 2000,
      retry: 0,
    },
  },
});

const client = generateClient<Schema>();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
});

// we need a default mutation function so that paused mutations can resume after a page reload
queryClient.setMutationDefaults(addKey, {
  mutationFn: async (title) => {
    // to avoid clashes with our optimistic update when an offline mutation continues

    await queryClient.cancelQueries({ queryKey });
    const { data } = await client.models.Post.create({
      title,
    });
    return Promise.resolve(data);
  },
});

queryClient.setMutationDefaults(deleteKey, {
  mutationFn: async (id) => {
    // to avoid clashes with our optimistic update when an offline mutation continues

    await queryClient.cancelQueries({ queryKey });
    const { data } = await client.models.Post.delete({
      id,
    });
    return Promise.resolve(data);
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister }}
      onSuccess={() => {
        // resume mutations after initial restore from localStorage was successful
        queryClient.resumePausedMutations().then(() => {
          queryClient.invalidateQueries();
        });
      }}
    >
      <Layout>
        <App />
      </Layout>
      <ReactQueryDevtools initialIsOpen />
    </PersistQueryClientProvider>
  </React.StrictMode>
);
