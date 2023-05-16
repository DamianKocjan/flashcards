import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { type GetServerSideProps, type NextPage } from "next";

import { Categories } from "~/components/Home/Categories";
import { Popular } from "~/components/Home/Popular";
import { Search } from "~/components/Home/Search";

const HomePage: NextPage = () => {
  return (
    <div>
      <Search />
      <Categories />
      <Popular />
      {/* TODO: Slider: https://www.figma.com/file/9sLyz5tqdtzrywFYptSW2g/Flashcard-Webiste-Project-(Community)?type=design&node-id=3-2&t=JKTO7QoKhTpUxQos-0 */}
    </div>
  );
};

export default HomePage;

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...buildClerkProps(req),
    },
  };
};
