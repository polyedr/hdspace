import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Theme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import prettyBytes from 'pretty-bytes';
import { useDebouncedCallback } from 'use-debounce';
import { createStyles, makeStyles } from '@mui/styles';
import Skeleton from 'react-loading-skeleton';
import { enqueueSnackbar } from '@Redux/notification/actions';
import {
  importHtml,
  uploadUrlForCheckRobots,
  checkImportHTML,
  setValueImport,
} from '@Redux/project/actions';

import prevent from '@Utils/preventEvent';
import { selectCanImportSite } from '@Redux/project/selectors/screen';
import { selectImportValue } from '@Redux/project/selectors/base';
import 'react-loading-skeleton/dist/skeleton.css';

const useStyles = makeStyles<Theme>(({ palette, shape, spacing }) =>
  createStyles({
    form: {
      display: 'flex',
      justifyContent: 'stretch',
      alignItems: 'stretch',
      minHeight: 200,
    },
    label: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      border: ({ over }: any) =>
        `2px ${over ? 'solid' : 'dashed'} ${palette.primary.main}`,
      borderRadius: shape.borderRadius,
      opacity: ({ over, file }: any) => (over || file ? 1 : 0.5),
      backgroundColor: palette.grey[100],
      transition: 'opacity 0.1s ease',
      '&:hover': {
        opacity: 1,
      },
      padding: spacing(1),
    },
    summaryLabel: {
      display: 'flex',
      padding: '1px',
      justifyContent: 'left',
    },
    card: {
      margin: spacing(0, 1),
      maxWidth: 200,
      minWidth: 150,
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    field: {
      backgroundColor: '#ececec',
      padding: '0 0.5em',
      margin: '0.5em 0',
    },
    formActions: {
      padding: spacing(2, 0),
      textAlign: 'right',
      '& > *': {
        margin: spacing(0, 0.5),
      },
    },
    placeholder: {
      color: palette.grey[700],
    },
  }),
);

interface Props {
  onClose: (...args: any) => any;
}

const allowedMimeTypes = [
  'text/html',
  'text/css',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const HtmlImportForm: React.FC<Props> = ({ onClose }) => {
  const dispatch = useDispatch();
  const isCanImportSite = useSelector(selectCanImportSite);
  const calculationImportData = useSelector(selectImportValue);
  const canvasConvertedData = calculationImportData?.canvasData;
  const canvasNotSupportedTag = calculationImportData?.notSupportedTag;
  const importSuccessRawData = calculationImportData?.importSuccessRawData;
  const importSiteUrlErrorStatus = calculationImportData?.error;
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const classes = useStyles({ over, file: files });
  const [url, setUrl] = useState('');
  const [openPopup, setOpenPopup] = useState(false);

  const handleUrlSubmit = () => {
    if (!openPopup) {
      dispatch(checkImportHTML([], url));
    }
  };

  const handleUrlChangeDebounced = useDebouncedCallback((value) => {
    setUrl(value);
    dispatch(uploadUrlForCheckRobots(value));
  }, 500);

  const removeImportValue = () => {
    dispatch(
      setValueImport({
        notSupportedTag: null,
        canvasData: {},
        importSuccessRawData: {},
        error: false,
      }),
    );
  };

  const backButton = () => {
    setFiles([]);
    setUrl('');
    removeImportValue();
    setOpenPopup((isPopupOpen) => !isPopupOpen);
  };

  const handleFormSubmit = () => {
    const htmlCount = files.reduce((acc, curr) => {
      if (curr.type === 'text/html') return acc + 1;
      return acc;
    }, 0);

    if (htmlCount !== 1) {
      backButton();
      dispatch(
        enqueueSnackbar({
          message: htmlCount
            ? 'Only one HTML file allowed'
            : 'At least one HTML file required',
          options: { variant: 'error' },
        }),
      );
      return;
    }
    if (!openPopup) {
      dispatch(checkImportHTML(files, ''));
    }
  };

  const importHTMLCheck = () => {
    setOpenPopup((isPopupOpen) => !isPopupOpen);
    if (isCanImportSite) {
      handleUrlSubmit();
    } else {
      handleFormSubmit();
    }
  };

  const importStart = async () => {
    const importHtmlData = {
      imageFiles: canvasConvertedData.imageFiles,
      imageElements: canvasConvertedData.imageElements,
      element: canvasConvertedData.element,
    };
    dispatch(importHtml(importHtmlData));
    setFiles([]);
    setUrl('');
    removeImportValue();
    onClose();
  };

  const handleDrop = (ev: React.DragEvent<HTMLFormElement>) => {
    prevent(ev);
    const { files } = ev.dataTransfer;
    [...files].forEach((file) => {
      if (allowedMimeTypes.includes(file.type)) {
        setFiles((prevState) => [...prevState, file]);
      } else {
        dispatch(
          enqueueSnackbar({
            message: `Only ${allowedMimeTypes.join(' and ')} files allowed `,
            options: { variant: 'error' },
          }),
        );
      }
    });
    setOver(false);
  };

  const handleDragEnter = (ev) => {
    prevent(ev);
    setOver(true);
  };

  const handleDragLeave = (ev) => {
    prevent(ev);
    setOver(false);
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = ev.target;
    if (files) {
      setFiles((prevState) => [...prevState, ...files]);
    }
  };

  useEffect(() => {
    if (importSiteUrlErrorStatus) {
      setOpenPopup(true);
      backButton();
    }
    // eslint-disable-next-line
  }, [importSiteUrlErrorStatus]);

  useEffect(() => {
    removeImportValue();
    return () => {
      removeImportValue();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {openPopup && !importSiteUrlErrorStatus && (
        <div>
          <h3>Import Site Summary</h3>
          {Object.keys(importSuccessRawData).length !== 0 &&
          !calculationImportData?.error ? (
            <div>
              <label className={classes.summaryLabel}>
                {canvasNotSupportedTag
                  ? `Not supported HTML tag : ${canvasNotSupportedTag}`
                  : canvasNotSupportedTag !== null
                  ? 'All HTML tag is supported'
                  : null}
              </label>
              <br />
              <label className={classes.summaryLabel}>
                {`Total CSS files : ${importSuccessRawData?.totalCssFiles}`}
              </label>
              <br />
              <label className={classes.summaryLabel}>
                {`Total image files : ${importSuccessRawData?.totalImageFileUpload}`}
              </label>
              <br />
              <label className={classes.summaryLabel}>
                Total sucessfully upload image files :
                {importSuccessRawData?.totalUploadImage}
              </label>
              <br />

              <label className={classes.summaryLabel}>
                Total unsucessfully upload image files :
                {importSuccessRawData?.totalNotUploadImage}
              </label>
              <br />

              <span>
                {`Total sucessfully import site : ${importSuccessRawData?.successPercentage}%`}
              </span>

              <div className={classes.formActions}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={importStart}
                >
                  Import Site
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={backButton}
                >
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Skeleton count={6} />
              <div className={classes.formActions}>
                <Button variant="contained" color="secondary" disabled>
                  Import Site
                </Button>
                <Button variant="contained" color="primary" disabled>
                  Back
                </Button>
              </div>
            </>
          )}
        </div>
      )}
      {!openPopup && (
        <>
          <h3>Provide a URL</h3>
          <div>
            <TextField
              type="text"
              onChange={(ev) =>
                handleUrlChangeDebounced.callback(ev.target.value)
              }
              variant="outlined"
              fullWidth
              margin="dense"
              placeholder="URL"
            />
          </div>

          <h3>Or upload an HTML, IMAGE and CSS files</h3>

          <div>
            <form
              onDrop={handleDrop}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              className={classes.form}
            >
              <label htmlFor="html-input" className={classes.label}>
                {files.length ? (
                  files.map((file) => (
                    <Card
                      onClick={prevent}
                      className={classes.card}
                      key={file.name}
                    >
                      <CardContent>
                        <Typography
                          className={classes.field}
                          variant="subtitle1"
                        >
                          {file.name}
                        </Typography>

                        <Typography className={classes.field} variant="caption">
                          {`${prettyBytes(file.size)}`}
                        </Typography>
                      </CardContent>

                      <CardActions className={classes.actions}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            setFiles((prevState) =>
                              prevState.filter(
                                (prev) => prev.name !== file.name,
                              ),
                            )
                          }
                          title="Remove"
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  <div className={classes.placeholder}>
                    Click or drop file here to upload
                  </div>
                )}

                <input
                  hidden
                  id="html-input"
                  accept={allowedMimeTypes.join(',')}
                  type="file"
                  onChange={handleChange}
                  multiple
                />
              </label>
            </form>
          </div>

          <div className={classes.formActions}>
            <Button variant="contained" color="primary" onClick={onClose}>
              Cancel
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={importHTMLCheck}
              disabled={!files.length && !isCanImportSite}
            >
              Check Import Site
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default HtmlImportForm;
