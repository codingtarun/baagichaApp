/**
 * ═══════════════════════════════════════════════════════════════
 * BAAGICHA — WEEKLY TASKS (Home Screen)
 * ═══════════════════════════════════════════════════════════════
 *
 * Tabbed task list: Spray | Nutrition | Cultural.
 * Each task row shows icon, name, priority pill, timing, target, dose, PHI, brands.
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../theme/colors';
import { Typography } from '../../typography';
import SectionHeader from '../SectionHeader';
import PressableScale from '../PressableScale';

export interface TaskItem {
  name: string;
  nameHi: string;
  slug?: string | null;
  dose?: string | null;
  when: string;
  whenHi: string;
  target: string;
  brands?: Array<{ name: string; slug?: string | null }> | null;
  priority: 'essential' | 'recommended' | 'conditional';
  phi?: number | null;
  icon: string;
}

interface WeeklyTasksProps {
  tasks: {
    spray: TaskItem[];
    nutrition: TaskItem[];
    cultural: TaskItem[];
  };
  onViewAll?: () => void;
}

const TABS = [
  { key: 'spray', icon: 'spray-bottle', label: 'Spray', labelHi: 'स्प्रे' },
  { key: 'nutrition', icon: 'leaf', label: 'Nutrition', labelHi: 'पोषण' },
  { key: 'cultural', icon: 'scissors-cutting', label: 'Cultural', labelHi: 'सांस्कृतिक' },
] as const;

const PRIORITY_META: Record<string, { label: string; color: string }> = {
  essential: { label: 'Essential', color: Colors.priorityEssential },
  recommended: { label: 'Recommended', color: Colors.priorityRecommended },
  conditional: { label: 'If Needed', color: Colors.priorityConditional },
};

const ICON_MAP: Record<string, string> = {
  'fas fa-flask': 'flask',
  'fas fa-bug': 'bug',
  'fas fa-leaf': 'leaf',
  'fas fa-seedling': 'seedling',
  'fas fa-scissors': 'content-cut',
  'fas fa-cut': 'content-cut',
  'fas fa-circle-dot': 'circle',
};

export default function WeeklyTasks({ tasks, onViewAll }: WeeklyTasksProps): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'spray' | 'nutrition' | 'cultural'>('spray');
  const activeTasks = tasks[activeTab];

  return (
    <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
      <SectionHeader icon="calendar-week" title="Weekly Tasks" titleHi="साप्ताहिक कार्य" actionLabel="Schedule" onAction={onViewAll} />

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
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
              </View>
            </PressableScale>
          );
        })}
      </View>

      {/* Task List */}
      <View style={styles.taskList}>
        {activeTasks.map((task, index) => {
          const pm = PRIORITY_META[task.priority];
          const iconName = ICON_MAP[task.icon] ?? 'circle';
          return (
            <PressableScale key={index} scale={0.98}>
              <View style={styles.taskRow}>
                <View style={[styles.taskIconWrap, { backgroundColor: pm.color + '14' }]}>
                  <Icon name={iconName} size={18} color={pm.color} />
                </View>
                <View style={styles.taskBody}>
                  <View style={styles.taskNameRow}>
                    <Typography variant="taskName" style={{ flex: 1, marginRight: 8 }} numberOfLines={1}>
                      {task.name}
                    </Typography>
                    <View style={[styles.priorityPill, { backgroundColor: pm.color + '14', borderColor: pm.color + '30' }]}>
                      <Typography variant="overline" style={{ fontSize: 9, color: pm.color, fontWeight: '700' }}>
                        {pm.label}
                      </Typography>
                    </View>
                  </View>
                  <Typography variant="hindiBody">{task.nameHi}</Typography>
                  <View style={styles.metaRow}>
                    <Typography variant="taskMeta"><Icon name="clock-outline" size={10} color={Colors.gray400} /> {task.when}</Typography>
                    <Typography variant="taskMeta"><Icon name="target" size={10} color={Colors.gray400} /> {task.target}</Typography>
                  </View>
                  <View style={styles.pillRow}>
                    {task.dose && (
                      <View style={styles.dosePill}>
                        <Icon name="flask-outline" size={10} color={Colors.primary} />
                        <Typography variant="caption" style={styles.doseText}>{task.dose}</Typography>
                      </View>
                    )}
                    {task.phi && (
                      <View style={styles.phiPill}>
                        <Typography variant="overline" style={{ fontSize: 9, color: Colors.warning, fontWeight: '700' }}>
                          PHI {task.phi}d
                        </Typography>
                      </View>
                    )}
                  </View>
                  {task.brands && task.brands.length > 0 && (
                    <View style={styles.brandRow}>
                      <Icon name="store-outline" size={10} color={Colors.gray400} />
                      {task.brands.map((b, i) => (
                        <View key={i} style={styles.brandChip}>
                          <Typography variant="caption" style={styles.brandText}>{b.name}</Typography>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
                {/* Actions */}
                <View style={styles.taskActions}>
                  <PressableScale scale={0.85} onPress={() => {}}>
                    <View style={styles.actionBtn}>
                      <Icon name="check-circle-outline" size={20} color={Colors.gray300} />
                    </View>
                  </PressableScale>
                  <PressableScale scale={0.85} onPress={() => {}}>
                    <View style={styles.actionBtn}>
                      <Icon name="bookmark-outline" size={18} color={Colors.gray300} />
                    </View>
                  </PressableScale>
                </View>
              </View>
            </PressableScale>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: Colors.surfaceSubtle,
    gap: 2,
  },
  tabActive: {
    backgroundColor: Colors.primary + '12',
  },
  tabLabel: {
    color: Colors.gray500,
    fontWeight: '600',
    fontSize: 12,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabLabelHi: {
    fontSize: 9,
    color: Colors.gray400,
  },
  taskList: {
    gap: 10,
  },
  taskRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  taskIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskBody: {
    flex: 1,
    gap: 4,
  },
  taskNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityPill: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  dosePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary + '08',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  doseText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 11,
  },
  phiPill: {
    backgroundColor: Colors.warning + '10',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  brandChip: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  brandText: {
    color: Colors.gray500,
    fontSize: 10,
    fontWeight: '600',
  },
  taskActions: {
    justifyContent: 'center',
    gap: 8,
    marginLeft: 8,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
