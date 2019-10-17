import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Modal } from '$components/UI/Modal';
import * as actions from '$redux/user/actions';

const styles = require('./styles.scss');

interface IComponentProps {
  messageModal: string,
  typeModal: string,
  onConfirm: (status: boolean) => void,
}

const Component: React.FunctionComponent<IComponentProps> = ({
  messageModal,
  typeModal,
  onConfirm,
}) => {
  switch (typeModal) {
    case 'deleteScreen':
      return (
        <Modal
          title=""
          confirmText="Delete"
          onConfirm={() => onConfirm(true)}
          cancelText="Close"
          onClose={() => onConfirm(false)}
        >
          <div className={styles.modalBody}>
            {messageModal}
          </div>
        </Modal>
      );
    case 'deleteElement':
      return (
        <Modal
          title=""
          confirmText="Add"
          onConfirm={() => onConfirm(true)}
          cancelText="Close"
          onClose={() => onConfirm(false)}
        >
          <div className={styles.modalBody}>
            {messageModal}
          </div>
        </Modal>
      );
    default: return null;
  }
};

const mapStateToProps = state => ({
  typeModal: state.user.typeModal,
  messageModal: state.user.messageModal,
  // isConfirmModal: state.user.isConfirmModal,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onConfirm: actions.onConfirmModal,
}, dispatch);

const Modals = connect(mapStateToProps, mapDispatchToProps)(Component);
export default Modals;
