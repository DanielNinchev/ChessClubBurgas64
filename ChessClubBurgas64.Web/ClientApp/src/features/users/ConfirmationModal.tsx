import { observer } from "mobx-react-lite"
import { useNavigate } from "react-router-dom";
import { Button, Modal, ModalActions, ModalContent, ModalHeader } from "semantic-ui-react"

interface ConfirmationModalProps {
    dimmer: any,
    open: boolean,
    headerContent: string;
    modalContent: string;
    confirm: string;
    deny: string;
    onConfirm: () => void,
    onClose: () => void;
}

export default observer(function ConfirmationModal(props: ConfirmationModalProps) {
    const navigate = useNavigate()
    return (
        <Modal
            dimmer={props.dimmer}
            open={props.open}
            onClose={props.onClose}
        >
            <ModalHeader>{props.headerContent}</ModalHeader>
            <ModalContent>
              {props.modalContent}
            </ModalContent>
            <ModalActions>
              <Button neutral onClick={props.onClose}>
                {props.deny}
              </Button>
              <Button negative onClick={props.onConfirm}>
                {props.confirm}
              </Button>
            </ModalActions>
        </Modal>
    )
})