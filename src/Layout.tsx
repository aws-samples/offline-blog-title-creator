import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import config from "../amplify_outputs.json";
Amplify.configure(config);

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col ">
      <Authenticator>
        <div className="flex-grow">{children}</div>
      </Authenticator>
    </div>
  );
}
