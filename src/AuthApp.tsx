import "./App.css";
import "@nlux/themes/nova.css";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import { SUPABASE_URL, SUPABASE_KEY, APPLICATION_ID } from "./config";

// Required for accessibility, attaches the modal to the app root
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function App() {
  const [session, setSession] = useState<any>(null);

  if (APPLICATION_ID === -1) {
    alert("Set your Key Trustee application ID.");
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return <App />;
  }
}

export default App;
