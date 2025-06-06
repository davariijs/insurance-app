import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import notFoundImage from '../assets/not-found.webp';


const NotFoundPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Result
        icon={
          <img 
            src={notFoundImage}
            alt="Page Not Found" 
            style={{ width: '300px', maxWidth: '90%' }} 
          />
        }
        title="404 - Page Not Found"
        subTitle="Oops! The page you are looking for does not exist or has been moved."
        extra={
          <Link to="/">
            <Button type="primary" size="large">
              Go Back Home
            </Button>
          </Link>
        }
      />
    </motion.div>
  );
};

export default NotFoundPage;