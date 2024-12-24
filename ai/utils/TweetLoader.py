import os
import pprint
from typing import Any, Dict, Iterable, List, Optional, Sequence, Union
from xml.dom.minidom import Document
from sympy import true, use
import tweepy
from tweepy import OAuthHandler, OAuth2BearerHandler

from langchain_core.documents import Document
from langchain_community.document_loaders.base import BaseLoader


class TweetLoader:
    def __init__(self, n_tweets: int, users: List[str]):
        self.n_tweets = n_tweets
        self.users = users

        try:
            self.__setClient()
            # self.api = tweepy.API(self.auth)
            print("[+] Tweepy API connector created successfully")
        except:
            print("[ERROR] Error creating auth")
            return

        # twitter_response = self.searchUsers()
        # self.load_documents(twitter_response)

    def __setClient(self):
        bearer_token = os.environ.get("X_BEARER_TOKEN")
        api_key = os.environ.get("X_API_KEY")
        api_secret = os.environ.get("X_API_SECRET")
        access_token = os.environ.get("X_ACCESS_TOKEN")
        access_token_secret = os.environ.get("X_ACCESS_TOKEN_SECRET")

        # Create authenticated client

        client = tweepy.Client(
            bearer_token=bearer_token,
            consumer_key=api_key,
            consumer_secret=api_secret,
            access_token=access_token,
            access_token_secret=access_token_secret,
            wait_on_rate_limit=true,
        )
        self.client = client

    def load(self) -> List[Document]:

        results: List[Document] = []

        for username in self.users:
            user = self.client.get_user(username=username)
            if isinstance(user, tweepy.Response):
                print("USER !!")
                print(user)
                print()
            if hasattr(user, "data") and user.data:
                user_id = user.data.id
                print(f"UserID: {user_id}")

            # rate limit happens here (╬▔皿▔)╯
            # also add quotes, mentions, blocked, quotetweets
            # full on spy on them, fuck it
            users_tweets: tweepy.Response = self.client.get_users_tweets(id=user_id)
            user_likes: tweepy.Response = self.client.get_liked_tweets(id=user_id)

            doc_likes = self._format_tweets(user_likes, user)
            doc_tweets = self._format_tweets(users_tweets, user)

            results.extend(doc_tweets)
            results.extend(doc_likes)

        return results

    def _format_tweets(
        self, tweets_response: tweepy.Response, user_response
    ) -> List[Document]:
        # TODO: add related tweets to metadata or document context
        # add:
        #   - referenced tweets
        #   - created_at
        documents = []

        if not tweets_response.data:
            return documents

        print("Tweets_response: \n")
        pprint.pprint(tweets_response)
        print()

        for tweet in tweets_response.data:
            metadata = {
                "id": tweet.id,
                # change to not be just id, get whole user context
                "author_id": user_response.data.id,
                "author_username": user_response.data.username,
                "created_at": tweet.created_at,
            }

            if hasattr(tweet, "referenced_tweets"):
                print(f"Referenced_tweets: \n {tweet.referenced_tweets}")
                metadata["referenced_tweets"] = tweet.referenced_tweets

            clean_meta = self._clean_metadata(metadata=metadata)
            print(f"[+]Clean metdata -> \n {clean_meta}")

            doc = Document(page_content=tweet.text, metadata=clean_meta)
            print("Generated document: \n")
            print(doc)
            print()
            documents.append(doc)

        return documents

    def _clean_metadata(self, metadata: Dict[str, Any]):
        clean_meta = {}

        for key, value in metadata.items():
            # if isinstance(value, datetime):
            #     clean_meta[key] = value.isoformat()
            if hasattr(value, "__dict__"):
                clean_meta[key] = str(value)

            elif isinstance(value, (str, int, float, bool)):
                clean_meta[key] = value

            elif value is None:
                clean_meta[key] = ""
        return clean_meta


# class ModedTwitterLoader(BaseLoader):
#     """Load `Twitter` tweets.

#     Read tweets of the user's Twitter handle.

#     First you need to go to
#     `https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api`
#     to get your token. And create a v2 version of the app.
#     """

#     def __init__(
#         self,
#         auth_handler: Union[OAuthHandler, OAuth2BearerHandler],
#         twitter_users: Sequence[str],
#         number_tweets: Optional[int] = 100,
#     ):
#         self.auth = auth_handler
#         self.twitter_users = twitter_users
#         self.number_tweets = number_tweets

#     def load(self) -> List[Document]:
#         """Load tweets."""
#         tweepy = self._dependable_tweepy_import()
#         api = tweepy.API(self.auth, parser=tweepy.parsers.JSONParser())

#         results: List[Document] = []
#         for username in self.twitter_users:
#             tweets = api.user_timeline(screen_name=username, count=self.number_tweets)
#             user = api.get_user(screen_name=username)
#             docs = self._format_tweets(tweets, user)
#             results.extend(docs)
#         return results

#     def _format_tweets(
#         self, tweets: List[Dict[str, Any]], user_info: dict
#     ) -> Iterable[Document]:
#         """Format tweets into a string."""
#         for tweet in tweets:
#             metadata = {
#                 "created_at": tweet["created_at"],
#                 "user_info": user_info,
#             }
#             yield Document(
#                 page_content=tweet["text"],
#                 metadata=metadata,
#             )

#     def _dependable_tweepy_import(self) -> tweepy:
#         try:
#             import tweepy
#         except ImportError:
#             raise ImportError(
#                 "tweepy package not found, please install it with `pip install tweepy`"
#             )
#         return tweepy

#     @classmethod
#     def from_bearer_token(
#         cls,
#         oauth2_bearer_token: str,
#         twitter_users: Sequence[str],
#         number_tweets: Optional[int] = 100,
#     ) -> TwitterTweetLoader:
#         """Create a TwitterTweetLoader from OAuth2 bearer token."""
#         tweepy = _dependable_tweepy_import()
#         auth = tweepy.OAuth2BearerHandler(oauth2_bearer_token)
#         return cls(
#             auth_handler=auth,
#             twitter_users=twitter_users,
#             number_tweets=number_tweets,
#         )

#     @classmethod
#     def from_secrets(
#         cls,
#         access_token: str,
#         access_token_secret: str,
#         consumer_key: str,
#         consumer_secret: str,
#         twitter_users: Sequence[str],
#         number_tweets: Optional[int] = 100,
#     ) -> TwitterTweetLoader:
#         """Create a TwitterTweetLoader from access tokens and secrets."""
#         tweepy = _dependable_tweepy_import()
#         auth = tweepy.OAuthHandler(
#             access_token=access_token,
#             access_token_secret=access_token_secret,
#             consumer_key=consumer_key,
#             consumer_secret=consumer_secret,
#         )
#         return cls(
#             auth_handler=auth,
#             twitter_users=twitter_users,
#             number_tweets=number_tweets,
#         )
