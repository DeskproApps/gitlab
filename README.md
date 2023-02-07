GitLab
===

Basic Usage
---

We recommend using [Yarn](https://yarnpkg.com/) to manage this project. First, start by installing the project 
dependencies from inside the project directory `app-template-vite`.

```bash
yarn install
```

Then, run the development server.

```bash
yarn start
```

You should now be able to view the bare-bones app in your browser.

For more information or to start developing an app, please take a look at our [developer guides](https://support.deskpro.com/en/guides/developers/apps/apps-1/anatomy-of-an-app).

Testing
---

We've included `jest` to run your tests. It will look anywhere in `/src` for test suite files ending in `.test.tsx`.

You can run all tests using:

```bash
yarn test
```

Run GitLab instance in Docker
---

how to install GitLab locally via docker: https://docs.gitlab.com/ee/install/docker.html

1. Run docker
    ```bash
    sudo docker run --detach \
      --hostname gitlab.example.com \
      --env GITLAB_OMNIBUS_CONFIG="external_url 'http://gitlab.example.com/'; gitlab_rails['store_initial_root_password'] = true;" \
      --publish 443:443 --publish 80:80 --publish 22:22 \
      --name gitlab-ce \
      --restart always \
      --volume $GITLAB_HOME/config:/etc/gitlab \
      --volume $GITLAB_HOME/logs:/var/log/gitlab \
      --volume $GITLAB_HOME/data:/var/opt/gitlab \
      --shm-size 256m \
      gitlab/gitlab-ce:latest
    ```
   
2. Connect to the docker container - `sudo docker exec -it gitlab-ce /bin/bash`

3. Run rails console - `gitlab-rails console -e production`

4. Create new user
    ```ruby
    u = User.new(username: 'root', email: 'root@admin.com', name: 'root', password: 'pa$$word', password_confirmation: 'pa$$word')
    u.skip_confirmation!
    u.save!
    ```
   
5. 
   1. open in the browser `localhost:80` and authorize

         or if you need a real URL (not localhost)

   2. run ngrok `ngrok http http://localhost` and copy `Forwarding` URL
   ![ngrok](/docs/assets/readme/ngrok.png)
