import React from 'react';
import { Spinner } from 'react-bootstrap';

interface ILoadingProps {
  loading: boolean;
  children: React.ReactElement;
  nested: boolean;
}

const Loading = ({ children, loading, nested }: ILoadingProps) => {
  if (loading)
    return <Spinner animation="border" as={nested ? 'span' : 'div'} />;
  return children;
};

export default Loading;
