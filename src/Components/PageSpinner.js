import React from 'react';
import { css } from '@emotion/react';
import { ClipLoader  } from 'react-spinners';
import CircularProgress from "@mui/material/CircularProgress";

const override = css`
  display: block;
  margin: 0 auto;
`;

const PageSpinner = () => {
  return (
    <div style={{ display: 'flex',overflow: 'hidden',  flexDirection: 'column', alignItems: 'center' }}>
      {/* Your form content */}
      <form>
        {/* Form fields go here */}
      </form>

      {/* Spinner */}
      <div style={{ marginTop: '200px' }}>
      <CircularProgress
                        size={45}
                        style={{ margin: "0px 5px 0px 5px" }}
                      /><span>Loading...</span>
      </div>
    </div>
  );
}

export default PageSpinner;


