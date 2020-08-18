import React, { useState } from "react";

import { CdsButton } from "components/Clarity/clarity";
import { useDispatch } from "react-redux";
import { IAppRepository, ISecret } from "shared/types";
import actions from "../../../actions";
import ConfirmDialog from "../../ConfirmDialog/ConfirmDialog.v2";
import { AppRepoAddButton } from "./AppRepoButton.v2";

import "./AppRepoControl.css";

interface IAppRepoListItemProps {
  repo: IAppRepository;
  namespace: string;
  kubeappsNamespace: string;
  secret?: ISecret;
}

export function AppRepoControl({
  namespace,
  repo,
  secret,
  kubeappsNamespace,
}: IAppRepoListItemProps) {
  const [modalIsOpen, setModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const dispatch = useDispatch();

  const handleDeleteClick = (repoName: string, repoNamespace: string) => {
    return () => {
      dispatch(actions.repos.deleteRepo(repoName, repoNamespace));
      closeModal();
    };
  };

  const handleResyncClick = (repoName: string, repoNamespace: string) => {
    return () => {
      setRefreshing(true);
      dispatch(actions.repos.resyncRepo(repoName, repoNamespace));
      // Fake timeout to show progress
      setTimeout(() => setRefreshing(false), 500);
    };
  };

  return (
    <div className="apprepo-control-buttons">
      <ConfirmDialog
        onConfirm={handleDeleteClick(repo.metadata.name, repo.metadata.namespace)}
        modalIsOpen={modalIsOpen}
        loading={false}
        closeModal={closeModal}
        confirmationText={`Are you sure you want to delete the repository ${repo.metadata.name}?`}
      />

      <AppRepoAddButton
        namespace={namespace}
        kubeappsNamespace={kubeappsNamespace}
        text="Edit"
        repo={repo}
        secret={secret}
        primary={false}
      />

      <CdsButton
        onClick={handleResyncClick(repo.metadata.name, repo.metadata.namespace)}
        action="outline"
        disabled={refreshing}
      >
        {refreshing ? "Refreshing" : "Refresh"}
      </CdsButton>
      <CdsButton status="danger" onClick={openModal} action="outline">
        Delete
      </CdsButton>
    </div>
  );
}
