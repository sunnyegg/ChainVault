import { Card, Text, ErrorWrapper } from "@tixia/design-system";
import { DUMMY_FILES } from "../../constants";
import { ModalDownload } from "./modals/modal-download";
import { List } from "./fragments/list";
import { ListGrid } from "./fragments/list-grid";
import { Filter } from "./fragments/filter";
import { ModalUploadSuccess } from "./modals/modal-upload-success";
import { useFileHandler } from "./hooks/useFileHandler";
import { useRef } from "react";
import { motion } from "framer-motion";

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
    handleDownload,
    uploadMutation,
    downloadMutation,
    uploadKey,
  } = useFileHandler();

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Filter
          openModal={openModal}
          view={view}
          setView={setView}
          handleFileChange={handleFileChange}
          uploadMutation={uploadMutation}
          fileInputRef={fileInputRef}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
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
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2"
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
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 2 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <Text variant="caption" className="text-center">
          Powered by <span className="font-bold text-primary">ChainVault</span>
        </Text>
      </motion.div>
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
