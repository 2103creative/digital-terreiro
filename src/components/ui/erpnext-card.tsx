import React from 'react';
import { cn } from "@/lib/utils";

interface ErpnextCardProps {
  children: React.ReactNode;
  className?: string;
}

interface ErpnextCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ErpnextCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface ErpnextCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface ErpnextCardContentProps {
  children: React.ReactNode;
  className?: string;
}

interface ErpnextCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const ErpnextCard = ({ className, children, ...props }: ErpnextCardProps) => {
  return (
    <div
      className={cn(
        "bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const ErpnextCardHeader = ({ className, children, ...props }: ErpnextCardHeaderProps) => {
  return (
    <div
      className={cn(
        "px-4 py-3 border-b border-gray-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const ErpnextCardTitle = ({ className, children, ...props }: ErpnextCardTitleProps) => {
  return (
    <h3
      className={cn(
        "text-base font-medium text-gray-800",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

const ErpnextCardDescription = ({ className, children, ...props }: ErpnextCardDescriptionProps) => {
  return (
    <p
      className={cn(
        "text-sm text-gray-600 mt-1",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

const ErpnextCardContent = ({ className, children, ...props }: ErpnextCardContentProps) => {
  return (
    <div
      className={cn(
        "p-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const ErpnextCardFooter = ({ className, children, ...props }: ErpnextCardFooterProps) => {
  return (
    <div
      className={cn(
        "px-4 py-3 border-t border-gray-200 bg-gray-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  ErpnextCard,
  ErpnextCardHeader,
  ErpnextCardTitle,
  ErpnextCardDescription,
  ErpnextCardContent,
  ErpnextCardFooter
}; 