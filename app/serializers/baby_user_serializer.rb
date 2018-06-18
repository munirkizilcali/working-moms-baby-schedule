class BabyUserSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :baby_id, :role, :active
end
