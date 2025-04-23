import style from './ModalEdit.module.css';

const ModalEdit = ({children,isOpen,closeModal}) => {
    return (
      <article className={`${style.modal} ${isOpen && style.isOpen}`}>
          <div className={style.modalContainer}>
              {/* <button 
                  className={style.modalClose}
                  onClick={closeModal}
                  translate='no'
              >X</button> */}
              {children}
          </div>
  
      </article>
    )
  }
  
  export default ModalEdit;