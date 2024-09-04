# BassTabMakerFrontend2

App to create bass guitar tablature. Second repo, meaning I created a v1, then started again from scratch.

Uses ReactQuery, with the pk for songs as the key. This way, whenever you select another song, useQuery is called automatically.

All queries are cached in 'songState'. This allows us to first check if a song has already been fetched before using the reactQuery response, which allows the user to tab between songs and persists unsaved changes.

Will likely create another branch and begin a large refactor, because feature creep has caused complecity to grow.


