import React from 'react';
import styles from '../../styles/tabs.module.css';

export type TabItem = {
  id: string;
  label: string;
};

export type TabGroup = {
  title: string;
  tabs: TabItem[];
};

type TabsContainerProps = {
  groups: TabGroup[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export function TabsContainer({ groups, activeTab, onTabChange }: TabsContainerProps) {
  return (
    <div className={styles.tabsContainer}>
      {groups.map((group) => (
        <div key={group.title} className={styles.tabsGroup}>
          <div className={styles.tabsGroupTitle}>{group.title}</div>
          <div className={styles.tabsRow}>
            {group.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
