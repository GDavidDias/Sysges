import style from './ModalUser.module.css';

const ModalUser = ({children,isOpen,closeModal}) => {
    return (
      <article className={`${style.modal} ${isOpen && style.isOpen}`}>
          <div className={style.modalContainer}>
              {/* <button 
                  className={style.modalClose}
                  onClick={closeModal}
              >X</button> */}
              {children}
          </div>
  
      </article>
    )
  }
  
  export default ModalUser;