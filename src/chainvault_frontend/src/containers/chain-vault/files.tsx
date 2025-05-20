import { Card, Text, ErrorWrapper } from "@tixia/design-system";
import { DUMMY_FILES } from "../../constants";
import { ModalDownload } from "./modals/modal-download";
import { List } from "./fragments/list";
import { ListGrid } from "./fragments/list-grid";
import { Filter } from "./fragments/filter";
import { ModalUploadSuccess } from "./modals/modal-upload-success";
import { useFileHandler } from "./hooks/useFileHandler";
import { useRef } from "react";

export const Files = () => {
  const {
    modalOpen,
    selectedItem,
    setSelectedItem,
    view,
    closeModal,
    openModal,
    setView,
    handleFileChange,
    handleSubmit,
    handleDownload,
    uploadMutation,
    downloadMutation,
    key,
    uploadKey,
  } = useFileHandler();

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <Filter
        openModal={openModal}
        view={view}
        setView={setView}
        handleFileChange={handleFileChange}
        uploadMutation={uploadMutation}
        handleSubmit={handleSubmit}
        fileInputRef={fileInputRef}
      />
      {view === "list" ? (
        <Card
          className={`${
            DUMMY_FILES.length
              ? "grid gap-2"
              : "flex items-center justify-center"
          } bg-white min-h-[200px]`}
        >
          {!!DUMMY_FILES.length ? (
            DUMMY_FILES.map((file) => (
              <List
                key={file?.name}
                {...file}
                setSelectedItem={setSelectedItem}
                openModal={openModal}
              />
            ))
          ) : (
            <ErrorWrapper
              customImage="/negative_case/search-not-found.svg"
              customMessage="No files in the vault"
              variant="data-not-found"
            />
          )}
        </Card>
      ) : (
        <Card
          className={`${
            DUMMY_FILES.length
              ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
              : "flex items-center justify-center"
          } bg-white min-h-[200px]`}
        >
          {!!DUMMY_FILES.length ? (
            DUMMY_FILES.map((file) => (
              <ListGrid
                key={file?.name}
                {...file}
                setSelectedItem={setSelectedItem}
                openModal={openModal}
              />
            ))
          ) : (
            <ErrorWrapper
              customImage="/negative_case/search-not-found.svg"
              customMessage="No files in the vault"
              variant="data-not-found"
            />
          )}
        </Card>
      )}
      <Text variant="caption" className="text-center">
        Powered by <span className="font-bold text-primary">ChainVault</span>
      </Text>
      <ModalDownload
        isOpen={modalOpen === "action"}
        onClose={closeModal}
        item={selectedItem}
        handleDownload={handleDownload}
        downloadMutation={downloadMutation}
      />
      <ModalUploadSuccess
        isOpen={modalOpen === "success"}
        onClose={closeModal}
        uploadKey={uploadKey}
      />
    </>
  );
};
