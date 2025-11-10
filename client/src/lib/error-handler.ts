/**
 * Error handling utilities
 * Provides consistent error messages and handling
 */

import { FirestoreError } from 'firebase/firestore';
import { logger } from './logger';

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  originalError?: unknown;
}

/**
 * Maps Firestore error codes to user-friendly messages
 */
function getFirestoreErrorMessage(error: FirestoreError): string {
  switch (error.code) {
    case 'permission-denied':
      return 'Você não tem permissão para realizar esta ação.';
    case 'not-found':
      return 'O item solicitado não foi encontrado.';
    case 'unavailable':
      return 'Serviço temporariamente indisponível. Tente novamente em alguns instantes.';
    case 'deadline-exceeded':
      return 'A operação demorou muito para ser concluída. Tente novamente.';
    case 'unauthenticated':
      return 'Você precisa estar autenticado para realizar esta ação.';
    case 'failed-precondition':
      return 'A operação não pode ser realizada no momento.';
    case 'aborted':
      return 'A operação foi cancelada.';
    case 'already-exists':
      return 'Este item já existe.';
    case 'resource-exhausted':
      return 'Limite de recursos excedido. Tente novamente mais tarde.';
    case 'cancelled':
      return 'Operação cancelada.';
    case 'data-loss':
      return 'Erro ao processar os dados.';
    case 'internal':
      return 'Erro interno do servidor. Tente novamente.';
    case 'invalid-argument':
      return 'Dados inválidos fornecidos.';
    case 'not-implemented':
      return 'Esta funcionalidade ainda não está disponível.';
    case 'out-of-range':
      return 'Valor fora do intervalo permitido.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
  }
}

/**
 * Handles Firestore errors and returns user-friendly error information
 */
export function handleFirestoreError(error: unknown): AppError {
  if (error instanceof FirestoreError) {
    logger.error('Firestore error occurred', error, { code: error.code });

    return {
      code: error.code,
      message: error.message,
      userMessage: getFirestoreErrorMessage(error),
      originalError: error,
    };
  }

  // Handle generic errors
  if (error instanceof Error) {
    logger.error('Generic error occurred', error);

    return {
      code: 'unknown',
      message: error.message,
      userMessage: 'Ocorreu um erro inesperado. Tente novamente.',
      originalError: error,
    };
  }

  // Handle unknown error types
  logger.error('Unknown error occurred', undefined, { error });

  return {
    code: 'unknown',
    message: 'Unknown error',
    userMessage: 'Ocorreu um erro inesperado. Tente novamente.',
    originalError: error,
  };
}

/**
 * Creates a user-friendly error message from any error
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  const appError = handleFirestoreError(error);
  return appError.userMessage;
}

