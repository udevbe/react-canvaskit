# Build
- `yarn install`
# Run
- `yarn start`

 Create-react-app has a bug with babel-loader processing node_modules, so running a dev server might fail. If this is
the case for you, you can try doing a production build instead.

- `yarn build`
- `yarn global add serve`
- `serve -s build`
