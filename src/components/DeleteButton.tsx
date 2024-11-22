'use client';
import Error from 'next/error';
import { Button } from './ui/button';

const DeleteButton = ({
  projectId,
  onClick,
}: {
  projectId: string;
  onClick: () => void;
}) => {
  const handleClick = async () => {
    console.log('delete', projectId);
    const deleteRes = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
    if (!deleteRes.ok) {
      const errorData = await deleteRes.json();
      throw new Error(errorData.message || 'Unable to delete project');
    } else {
      onClick();
    }
  };
  return (
    <Button variant={'destructive'} onClick={handleClick}>
      delete
    </Button>
  );
};

export default DeleteButton;
