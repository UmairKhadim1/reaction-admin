import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { useDropzone } from "react-dropzone";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import { useMutation } from "@apollo/react-hooks";
import Button from "@reactioncommerce/catalyst/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import { FileRecord } from "@reactioncommerce/file-collections";
import { registerComponent } from "@reactioncommerce/reaction-components";
import _ from "lodash";
import { i18next, Logger } from "/client/api";
import { resolve } from "core-js/fn/promise";
import useProduct from "../../../../../included/product-admin/client/hooks/useProduct";


const createMediaRecordMutation = gql`
  mutation CreateMediaRecord($input: CreateMediaRecordInput!) {
    createMediaRecord(input: $input) {
      mediaRecord {
        _id
      }
    }
  }
`;

/**
 * MediaUploader
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function MediaUploader(props) {
  const {
    product,
    updateProduct
  } = useProduct();
  const { canUploadMultiple, metadata, onError, onFiles, refetchProduct, shopId } = props;

  const [isUploading, setIsUploading] = useState(false);
  const [createMediaRecord] = useMutation(createMediaRecordMutation, { ignoreResults: true });

  const uploadFiles = (acceptedFiles) => {
    const filesArray = Array.from(acceptedFiles);
    setIsUploading(true);

    const promises = filesArray.map(async (browserFile) => {
      const fileRecord = FileRecord.fromFile(browserFile);

      if (metadata) {
        if (typeof metadata === "function") {
          fileRecord.metadata = metadata();
        } else {
          fileRecord.metadata = metadata;
        }
      }
      const fileUploadResponse = await startUpload(fileRecord);
       let mediaObject={
         URLs:{   
         large: fileUploadResponse.res.data[0]?.url,
         medium: fileUploadResponse.res.data[0]?.url,
         thumbnail: fileUploadResponse.res.data[0]?.url,
         small: fileUploadResponse.res.data[0]?.url
          },
         priority:fileUploadResponse.fileRecord.document.metadata.priority-1,
         productId:"null"
       }
       
       if(fileUploadResponse.res.data[0]?.url){
         let productMedia=product.media;
         if(productMedia&&productMedia.length>0){
           productMedia.push(mediaObject)
         }else{
           productMedia=mediaObject
         }
         let _productId=decodeOpaqueId(fileUploadResponse.fileRecord.document.metadata.productId).id
         await Meteor.call("products/updateProductField",_productId,"media",mediaObject)
         setIsUploading(false);

       }

      // await fileRecord.upload();
      //  return mediaObject;
      // We insert only AFTER the server has confirmed that all chunks were uploaded
      // return createMediaRecord({
      //   variables: {
      //     input: {
      //       mediaRecord: fileRecord.document,
      //       shopId
      //     }
      //   }
      // });
    });


    Promise.all(promises)
      .then((responses) => {
        // NOTE: This is a temporary workaround due to the fact that on the server,
        // the sharp library generates product images in an async manner.
     
        const uploadedMediaIds = responses.map((response) => response?.data.createMediaRecord.mediaRecord._id);

        // Poll server every two seconds to determine if all media has been successfully processed
        let isAllMediaProcessed = false;
        const timerId = setInterval(async () => {
          let { data: { product } } = await refetchProduct();

          // Get media for product, variants and options
          let allMedia = [product.media];
          if (product.variants) {
            product.variants.forEach((variant) => {
              // Add variant media if set
              if (variant.media) {
                allMedia.push(variant.media);
              }

              // Add option media if set
              if (variant.options) {
                variant.options.forEach((option) => {
                  allMedia.push(option.media);
                });
              }
            });
          }

          allMedia = _.flatten(allMedia);

          let mediaItems = [];
          allMedia.forEach((media) => {
            let { id } = decodeOpaqueId(media?._id);
            mediaItems.push({ id, thumbnailUrl: media.URLs.small });
          });

          isAllMediaProcessed = uploadedMediaIds.every((uploadedMediaId) => {
            let mediaItem = mediaItems.find((item) => item.id === uploadedMediaId);

            // If a url has been generated, then these media items has been processed successfully.
            return mediaItem && mediaItem.thumbnailUrl !== String(null);
          });

          if (isAllMediaProcessed) {
            setIsUploading(false);
            clearTimeout(timerId);
          }
        }, 2000);

        // Stop polling after 30 seconds
        setTimeout(() => {
          clearTimeout(timerId);
          setIsUploading(false);
        }, 30000);

        return null;
      })
      .catch((error) => {
        setIsUploading(false);
        if (onError) {
          onError(error);
        } else {
          Logger.error(error);
        }
      });
  };
  const startUpload = (fileRecord) => {
    console.log("startUpload", fileRecord)
    return new Promise((resolve, reject) => {
      const files = [fileRecord.data]
      var formdata = new FormData();
      formdata.append("isMulti", files.length > 1 ? "true" : "false");
      files.map((file) => {
        formdata.append("photos", file, file.name);
      });
      formdata.append("uploadPath", fileRecord.document.metadata.variantId ? `userProducts/${fileRecord.document.metadata.variantId}/` : `public/${fileRecord.document.metadata.productId}/`);

      var requestOptions = {
        method: "POST",
        body: formdata,
        redirect: "follow",
      };
      //http://localhost:3000/upload
      //https://staging_backend.landofsneakers.com
      //backend.landofsneakers.com/upload
      fetch("https://api.landofsneakers.com/upload", requestOptions)
        .then((response) => response.json())
        .then(async (result) => {
          console.log("file upload response", result)
          resolve({ res: result, fileRecord })
        });
    })
  }
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpg, image/png, image/jpeg",
    disableClick: true,
    disablePreview: true,
    multiple: canUploadMultiple,
    onDrop(files) {
      console.log("files to upload", files)
      if (files.length === 0) return;

      // Pass onFiles func to circumvent default uploader
      if (onFiles) {
        onFiles(files);
      } else {
        uploadFiles(files);
      }
    }
  });

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input {...getInputProps()} />
      {isUploading ?
        <LinearProgress />
        :
        <Button fullWidth size="large" variant="outlined">{i18next.t("reactionUI.components.mediaUploader.dropFiles")}</Button>
      }
    </div>
  );
}

MediaUploader.propTypes = {
  canUploadMultiple: PropTypes.bool,
  metadata: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  onError: PropTypes.func,
  onFiles: PropTypes.func,
  refetchProduct: PropTypes.func,
  shopId: PropTypes.string
};

MediaUploader.defaultProps = {
  canUploadMultiple: false
};

registerComponent("MediaUploader", MediaUploader);

export default MediaUploader;
