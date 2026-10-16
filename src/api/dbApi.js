import { supabase } from './supabaseClient'

// Получить всех персонажей, созданных пользователями
export async function getDbCharacters() {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Получить только персонажей текущего пользователя
export async function getUserCharacters(userId) {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Создать нового персонажа
export async function addDbCharacter(character) {
  const { data, error } = await supabase
    .from('characters')
    .insert([character])
    .select()
  if (error) throw error
  return data
}

// Удалить персонажа по id
export async function deleteDbCharacter(id) {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// Удалить ВСЕХ персонажей пользователя
export async function clearUserCharacters(userId) {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}

// Добавить в избранное
export async function addToFavorites(userId, character) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([{
      user_id: userId,
      character_api_id: character.id,
      character_name: character.name,
      character_image: character.image
    }])
    .select()
  if (error) throw error
  return data
}

// Получить избранное пользователя
export async function getFavorites(userId) {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

// Удалить одно из избранного
export async function removeFromFavorites(userId, characterApiId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('character_api_id', characterApiId)
  if (error) throw error
}

// Удалить ВСЁ избранное пользователя
export async function clearUserFavorites(userId) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}

// Логировать событие аналитики
export async function logAnalyticsEvent(userId, eventType, entityType, entityId, metadata = {}) {
  const { error } = await supabase
    .from('analytics_events')
    .insert([{
      user_id: userId,
      event_type: eventType,
      entity_type: entityType,
      entity_id: entityId,
      metadata
    }])
  if (error) console.error('Analytics error:', error)
}

// Очистить всю историю аналитики
export async function clearAnalytics(userId) {
  const { error } = await supabase
    .from('analytics_events')
    .delete()
    .eq('user_id', userId)
  if (error) throw error
}

// Очистить историю по типу события
export async function clearAnalyticsByType(userId, eventType) {
  const { error } = await supabase
    .from('analytics_events')
    .delete()
    .eq('user_id', userId)
    .eq('event_type', eventType)
  if (error) throw error
}
