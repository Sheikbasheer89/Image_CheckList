import React from "react";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import Button from "@mui/material/Button";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import { DropDown } from "./CommonFunction";

const ControlPanel = (props) => {
  const {
    file,
    pageNumber,
    numPages,
    setPageNumber,
    scale,
    setScale,
    rotate,
    setrotation,
  } = props;

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === numPages;

  const firstPageClass = isFirstPage ? "disabled" : "clickable";
  const lastPageClass = isLastPage ? "disabled" : "clickable";

  // const goToFirstPage = () => {
  //   if (!isFirstPage) setPageNumber(1);
  // };
  // const goToPreviousPage = () => {
  //   if (!isFirstPage) setPageNumber(pageNumber - 1);
  // };
  // const goToNextPage = () => {
  //   if (!isLastPage) setPageNumber(pageNumber + 1);
  // };
  // const goToLastPage = () => {
  //   if (!isLastPage) setPageNumber(numPages);
  // };

  const onPageChange = (e) => {
    const { value } = e.target;
    setPageNumber(Number(value));
  };

  const isMinZoom = scale < 0.1;
  const isMaxZoom = scale >= 2.0;

  const zoomOutClass = isMinZoom ? "disabled" : "clickable";
  const zoomInClass = isMaxZoom ? "disabled" : "clickable";

  const zoomOut = () => {
    if (!isMinZoom) {

    const newScale = Math.max(scale - 0.1, 0.1);
    setScale(newScale);

    }
    
    // setScale(scale - 0.1);
  };

  const zoomIn = () => {
    if (!isMaxZoom){
      const newScale = Math.min(scale + 0.1, 2.0);
      setScale(newScale);


    } 
    // setScale(scale + 0.1);
  };

  const handleRotateClick = () => {
    setrotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const panWidth = () => {
    if (
      document.querySelector(".react-pdf__Page__canvas").style.width !== "100%"
    )
      document.querySelector(".react-pdf__Page__canvas").style.width = "100%";
    else document.querySelector(".react-pdf__Page__canvas").style.width = "";
  };

  return (
    <div
      className="control-panel align-items-baseline justify-content-between"
      style={{ display: "inline-flex" }}
    >
      {/* <div className="d-flex justify-content-between align-items-baseline">
        <i
          className={`fas fa-fast-backward mx-3 ${firstPageClass}`}
          onClick={goToFirstPage}
        />
        <i
          className={`fas fa-backward mx-3 ${firstPageClass}`}
          onClick={goToPreviousPage}
        />
        <span>
          Page{" "}
          <input
            name="pageNumber"
            type="number"
            min={1}
            max={numPages || 1}
            className="p-0 pl-1 mx-2"
            value={pageNumber}
            onChange={onPageChange}
          />{" "}
          of {numPages}
        </span>
        <i
          className={`fas fa-forward mx-3 ${lastPageClass}`}
          onClick={goToNextPage}
        />
        <i
          className={`fas fa-fast-forward mx-3 ${lastPageClass}`}
          onClick={goToLastPage}
        />
      </div> */}
      <div
        className="d-flex justify-content-between align-items-baseline"
        style={{
          border: "1px solid gray",
          padding: "8px",
          // marginLeft: "-11px",
        }}
      >
        {/* <i
          className={`fas fa-search-minus mx-3 ${zoomOutClass}`}
          onClick={zoomOut}
        /> */}
        <span onClick={zoomOut}>
          <Button
            variant="contained"
            size="small"
            style={{ marginRight: "5px" }}
          >
            <ZoomOutIcon fontSize="medium"></ZoomOutIcon> Zoom Out
          </Button>
        </span>
        <span>{(scale * 100).toFixed()}%</span>
        {/* <i
          className={`fas fa-search-plus mx-3 ${zoomInClass}`}
          onClick={zoomIn}
        /> */}
        <span onClick={zoomIn}>
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: "5px" }}
          >
            <ZoomInIcon fontSize="medium"></ZoomInIcon> Zoom In
          </Button>
        </span>
        <span onClick={panWidth}>
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: "5px" }}
          >
            <SyncAltIcon></SyncAltIcon>
            {"  "}Pan
          </Button>
        </span>
        <span onClick={handleRotateClick}>
          <Button
            variant="contained"
            size="small"
            style={{ marginLeft: "5px" }}
          >
            <RotateRightIcon></RotateRightIcon>
            {"  "}Rotate
          </Button>
        </span>
      </div>
    </div>
  );
};

export default ControlPanel;
