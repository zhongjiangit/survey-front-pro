'use client';
import { useSurveyCurrentRoleStore } from '@/contexts/useSurveyRoleStore';

export function useRoles() {
  return useSurveyCurrentRoleStore(state => state.roles);
}
