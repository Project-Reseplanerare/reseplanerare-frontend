//searchbtnstore interface
interface searchBtnStore {
  isButtonClicked: boolean;
  setIsButtonClicked: (status: boolean) => void;
}

export default searchBtnStore;
