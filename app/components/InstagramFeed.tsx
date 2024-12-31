import type {InstagramPost} from '~/lib/instagram';

export const InstagramFeed = ({
  instagramPosts,
}: {
  instagramPosts: InstagramPost[];
}) => {
  console.log(instagramPosts);
  return <div>InstagramFeed</div>;
};
