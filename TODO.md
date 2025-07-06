# TODO List

- [ ] Rule page: Need to delete extra stuff (Miyuki)

- [ ] Touch screen support for paddles
- [ ] Finish translation (Miyuki, Valle for Finnish)
- [ ] Simple CSS for profile page (Valle)
- [ ] Username validation in settings: Show clear message when username is taken instead of error code (NOTE: Its because we use the api.ts file which only returns the code. we need to specialize the messages. not have it show error code only. it doesnt give the user enought information. can i change away the baseService and use axios instead?)
- [ ] Convert remaining frontend files to TypeScript (Oliver)
- [ ] Avatar_url: /uploads/placeholder-avatar2.png does not load in Profile Page (Kim)

### Completed ✅
- [x] Adjust game screen based on screen size (Valle)
- [x] Remove theme setting from settings page
- [x] Remove Swedish translation option from settings page
- [x] Google signin button (test version fixed) (Kim)
- [x] Player creation error messages. Now shows clear message instead of "Failed to create player: asd"

## 🐛 Bug Fixes
- [ ] friend's online status seems to always state online when friend is offline.
(NOTE: the issue is that the api for the logout is not connected to the backend. thats why) can somebody connect it?

### Fixed Bugs ✅
- [x] Profile page navigation bug. Some weird bug with navigating to profile page of some users. it does not update profile id without refreshing page after changing to different user. (Maybe done)
- [x] When (1 hour?) timer is up and app logs you out, it is still possible to open pages but not possible to do actions. (maybe just make sure to check everytime page loads that you are logged in, otherwise redirect to dashboard).










