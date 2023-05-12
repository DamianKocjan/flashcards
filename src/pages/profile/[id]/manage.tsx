import { UserProfile } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { type GetServerSidePropsContext, type NextPage } from "next";

import { getUser } from "~/server/api/helpers/userCache";

const ProfileManagePage: NextPage = () => {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center px-8 py-12 md:py-16">
      <UserProfile
        appearance={{
          elements: {
            card: "shadow-none",
            formFieldInput: "accent-blue-500 border-slate-300",
            formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
            footerActionLink: "text-blue-500 hover:text-blue-600",
          },
        }}
      />
    </div>
  );
};

export default ProfileManagePage;

type Params = {
  id: string;
};

export const getServerSideProps = async ({
  params,
  req,
  resolvedUrl,
}: GetServerSidePropsContext<Params>) => {
  const id = params?.id;
  if (!id) {
    return {
      notFound: true,
    };
  }

  const user = await getUser(id);
  if (!user) {
    return {
      notFound: true,
    };
  }

  const auth = getAuth(req);
  if (!auth) {
    return {
      redirect: {
        destination: `/sign-in?redirect=${resolvedUrl}`,
        permanent: false,
      },
    };
  } else if (auth.userId !== id) {
    return {
      redirect: {
        destination: `/profile/${id}`,
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
