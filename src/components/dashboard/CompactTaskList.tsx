/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — COMPACT TASK LIST
 * ═══════════════════════════════════════════════════════════════
 *
 * Collapsible weekly tasks with compact row layout.
 * Internal tab bar: Spray | Nutrition | Cultural
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import PressableScale from '../PressableScale';

export interface CompactTask {
  id: string;
  name: string;
  nameHi: string;
  due: string;
  dueHi?: string;
  priority: 'essential' | 'recommended' | 'conditional';
  done?: boolean;
  onToggle?: (id: string) => void;
}

interface CompactTaskListProps {
  tasks: {
    spray: CompactTask[];
    nutrition: CompactTask[];
    cultural: CompactTask[];
  };
  onViewAll?: () => void;
}

const TABS = [
  { key: 'spray' as const, icon: 'spray-bottle', label: 'Spray', labelHi: 'स्प्रे' },
  { key: 'nutrition' as const, icon: 'leaf', label: 'Nutrition', labelHi: 'पोषण' },
  { key: 'cultural' as const, icon: 'scissors-cutting', label: 'Cultural', labelHi: 'सांस्कृतिक' },
];

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  essential: { label: 'Essential', color: Colors.priorityEssential },
  recommended: { label: 'Recommended', color: Colors.priorityRecommended },
  conditional: { label: 'If Needed', color: Colors.priorityConditional },
};

export default function CompactTaskList({ tasks, onViewAll }: CompactTaskListProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'spray' | 'nutrition' | 'cultural'>('spray');
  const activeTasks = tasks[activeTab];
  const totalCount = tasks.spray.length + tasks.nutrition.length + tasks.cultural.length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="displayHeading" style={styles.title}>Weekly Tasks</Typography>
        <Typography variant="hindiDisplaySection" style={styles.titleHi}>साप्ताहिक कार्य</Typography>
        {onViewAll && (
          <TouchableOpacity onPress={onViewAll} style={styles.viewAll}>
            <Typography variant="link" style={styles.viewAllText}>View All</Typography>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tasks[tab.key].length;
          return (
            <PressableScale key={tab.key} scale={0.95} onPress={() => setActiveTab(tab.key)} style={{ flex: 1 }}>
              <View style={[styles.tab, isActive && styles.tabActive]}>
                <Icon name={tab.icon} size={14} color={isActive ? Colors.primary : Colors.gray400} />
                <Typography variant="caption" style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.label}
                </Typography>
                <Typography variant="hindiMicro" style={[styles.tabLabelHi, isActive && { color: Colors.primary }]}>
                  {tab.labelHi}
                </Typography>
                <View style={[styles.countBadge, isActive && { backgroundColor: Colors.primary + '14' }]}>
                  <Typography variant="overline" style={{ fontSize: 9, color: isActive ? Colors.primary : Colors.gray400, fontWeight: '700' }}>
                    {count}
                  </Typography>
                </View>
              </View>
            </PressableScale>
          );
        })}
      </View>

      {/* Task rows */}
      <View style={styles.list}>
        {activeTasks.slice(0, 3).map((task) => {
          const pm = PRIORITY_META[task.priority];
          return (
            <View key={task.id} style={styles.row}>
              <TouchableOpacity
                style={[styles.checkbox, task.done && styles.checkboxDone]}
                onPress={() => task.onToggle?.(task.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: !!task.done }}
              >
                {task.done && <Icon name="check" size={12} color={Colors.white} />}
              </TouchableOpacity>
              <View style={styles.rowBody}>
                <View style={styles.rowTop}>
                  <Typography variant="bodySmall" style={[styles.taskName, task.done && styles.taskNameDone]} numberOfLines={1}>
                    {task.name}
                  </Typography>
                  <View style={[styles.priorityPill, { backgroundColor: pm.color + '12', borderColor: pm.color + '25' }]}>
                    <Typography variant="overline" style={{ fontSize: 8, color: pm.color, fontWeight: '700' }}>
                      {pm.label}
                    </Typography>
                  </View>
                </View>
                <Typography variant="hindiMicro" style={styles.taskNameHi}>{task.nameHi}</Typography>
                <Typography variant="captionMuted" style={styles.due}>Due: {task.due}</Typography>
              </View>
            </View>
          );
        })}
        {activeTasks.length > 3 && (
          <TouchableOpacity style={styles.moreRow} onPress={onViewAll}>
            <Typography variant="caption" style={styles.moreText}>
              + {activeTasks.length - 3} more tasks
            </Typography>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
  },
  titleHi: {
    color: Colors.gray400,
    flex: 1,
  },
  viewAll: {
    marginLeft: 'auto',
  },
  viewAllText: {
    fontSize: 12,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surfaceSubtle,
  },
  tabActive: {
    backgroundColor: Colors.primary + '10',
  },
  tabLabel: {
    color: Colors.gray500,
    fontWeight: '600',
    fontSize: 11,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabLabelHi: {
    fontSize: 8,
    color: Colors.gray400,
  },
  countBadge: {
    backgroundColor: Colors.gray100,
    borderRadius: 999,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 2,
  },
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray200,
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  rowBody: {
    flex: 1,
    gap: 1,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskName: {
    fontWeight: '700',
    color: Colors.gray900,
    flex: 1,
  },
  taskNameDone: {
    textDecorationLine: 'line-through',
    color: Colors.gray400,
  },
  taskNameHi: {
    color: Colors.gray400,
  },
  due: {
    marginTop: 1,
  },
  priorityPill: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
  },
  moreRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  moreText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
