#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------

# To fully customize the contents of this image, use the following Dockerfile instead:
# https://github.com/microsoft/vscode-dev-containers/tree/v0.106.0/containers/typescript-node-12/.devcontainer/Dockerfile
FROM atweel/vscode-devcontainer-typescript-node:12

ARG USERNAME=user
ARG USER_UID=1001
ARG USER_GID=$USER_UID

RUN apt-get update && \
    apt-get -y install software-properties-common && \
    apt-get update && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian \
    $(lsb_release -cs) \
    stable" && \
    apt-get update && \
    apt-get -y install docker-ce-cli && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" && \
    unzip /tmp/awscliv2.zip -d /tmp/awscliv2 && \
    /tmp/awscliv2/aws/install && \
    apt-get -y install jq && \
    groupadd -g ${USER_GID} ${USERNAME} && \
    useradd ${USERNAME} -u ${USER_UID} -g ${USER_GID} && \
    passwd -d ${USERNAME} && \
    usermod -a -G sudo ${USERNAME} && \
    mkdir -p /home/$USERNAME && \
    chown -R $USER_UID:$USER_GID /home/$USERNAME

RUN yarn global add typescript lerna jest

USER ${USERNAME}

